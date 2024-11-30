import {
  RTCConstructorType,
  CallRespondMethodParamsType,
  CallMethodReturnType,
  ConnectMethodParamsType,
  RespondMethodParamsExtensionType,
  RespondMethodReturnType,
} from "./@interfaces";
import { handleDataChannelMessageType, StreamTypeType } from "./@types";
import { nanoid } from "nanoid";
import adapter from "webrtc-adapter";

// ADAPTER SETTINGS
adapter.disableLog(true);
adapter.disableWarnings(true);
// *************************

export default class RTC {
  connection: RTCPeerConnection | null;
  constraints: RTCConstructorType["constraints"];
  configurations: RTCConstructorType["configurations"];
  streamType: RTCConstructorType["streamType"];
  localStream: MediaStream | null;
  recorder: MediaRecorder | null;
  blobs: Blob[];
  datachannel: RTCDataChannel | null;

  constructor({ configurations, constraints, streamType }: RTCConstructorType) {
    this.connection = null;
    this.constraints = constraints;
    this.configurations = configurations;
    this.streamType = streamType;
    this.localStream = null;
    this.recorder = null;
    this.blobs = [];
    this.datachannel = null;
  }

  async call(
    {
      handleCandidate,
      handleRemoteStream,
    }: CallRespondMethodParamsType["handlers"],
    options?: CallRespondMethodParamsType["options"]
  ): Promise<CallMethodReturnType | undefined | Error> {
    try {
      // Get media
      const stream = await this.getMedia();
      this.localStream = stream;

      // Handle connection
      this.connect({
        handleCandidate,
        handleRemoteStream,
        handleCandidateError: options?.handleCandidateError,
      });

      return new Promise(async (resolve, reject) => {
        try {
          const offer = await this.connection!.createOffer({
            offerToReceiveAudio: this.streamType === "audio",
            offerToReceiveVideo: this.streamType !== "audio",
            iceRestart: true,
          });

          this.connection?.setLocalDescription(offer);

          // Return their own STREAM so they can consume it
          // however they want and the offer
          // so they can send it to the signaling server
          resolve({
            stream: stream,
            offer,
            streamType: this.streamType,
            call_id: nanoid(),
          });
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      // Handle error
      if (options?.handleError && typeof options.handleError === "function") {
        options.handleError(e as Error);
      }

      return;
    }
  }

  async respond(
    {
      handleCandidate,
      handleRemoteStream,
      streamType,
      offer,
    }: CallRespondMethodParamsType["handlers"] &
      RespondMethodParamsExtensionType,
    options?: CallRespondMethodParamsType["options"] & {
      handleConflict?: (instance: RTC) => void;
    }
  ): Promise<RespondMethodReturnType | undefined | Error> {
    if (this.connection) {
      // Handle the conflict
      if (
        options?.handleConflict &&
        typeof options.handleConflict == "function"
      ) {
        options.handleConflict(this);
      }
    } else {
      try {
        // Get Media
        const stream = await this.getMedia(streamType || this.streamType);
        this.localStream = stream;

        // Handle connection
        this.connect({
          handleCandidate,
          handleRemoteStream,
          handleCandidateError: options?.handleCandidateError,
        });

        return new Promise(async (resolve, reject) => {
          try {
            // ****************** 1 IMPORTANT STEP IN THE CONNECTION *******
            this.connection?.setRemoteDescription(offer);
            // ***********************************************************

            const answer = await this.connection!.createAnswer();

            // ****************** 2 IMPORTANT STEP IN THE CONNECTION *******
            this.connection?.setLocalDescription(answer);
            // ***********************************************************

            resolve({
              stream: stream,
              answer,
              streamType: streamType || this.streamType,
            });
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        // Handle error
        if (options?.handleError && typeof options.handleError === "function") {
          options.handleError(e as Error);
        }

        return;
      }
    }
  }

  terminate({
    handleSuccess,
    handleError,
  }: {
    handleSuccess: (blobs: Blob[]) => void;
    handleError?: (e: Error) => void;
  }) {
    try {
      const savedBlobs = this.blobs;

      this.connection?.close();
      this.datachannel?.close();
      this.localStream?.getTracks().forEach((track) => {
        track.stop();
      });
      this.localStream = null;
      this.blobs = [];
      this.recorder = null;

      handleSuccess(savedBlobs);
    } catch (e) {
      if (typeof handleError === "function") {
        handleError(e as Error);
      }
    }
  }

  handleCallAccepted(
    answer: RTCSessionDescriptionInit,
    ifNoConnection?: ConnectMethodParamsType
  ) {
    try {
      if (!this.connection) {
        if (ifNoConnection) {
          this.connect(ifNoConnection);
        }
      }

      // Store the answer as a remote descriptor
      this.connection!.setRemoteDescription(answer);

      return true;
    } catch (e) {
      return false;
    }
  }

  handleIceReceipt(ice: RTCIceCandidate) {
    try {
      if (this.connection) {
        this.connection.addIceCandidate(ice);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  toggleMute(state: boolean): boolean {
    try {
      this.localStream?.getAudioTracks().forEach((track) => {
        track.enabled = state;
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  toggleHide(state: boolean): boolean {
    try {
      this.localStream?.getVideoTracks().forEach((track) => {
        track.enabled = state;
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  private connect({
    handleCandidate,
    handleRemoteStream,
    handleCandidateError,
  }: ConnectMethodParamsType) {
    // Create a new connection
    this.connection = new RTCPeerConnection(this.configurations);

    // Attach the media stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.connection!.addTrack(track);
      });
    }

    // Handle ICE Candidate creation
    this.connection!.addEventListener("icecandidate", function ({ candidate }) {
      handleCandidate(candidate);
    });

    // Handle ICE Candidate creation error
    this.connection?.addEventListener(
      "icecandidateerror",
      function ({ address, errorCode, errorText, url }) {
        if (
          handleCandidateError &&
          typeof handleCandidateError === "function"
        ) {
          handleCandidateError({
            address,
            errorCode,
            errorText,
            url,
          });
        }
      }
    );

    // Handle remote stream receipt
    this.connection?.addEventListener(
      "track",
      function ({ receiver, streams, transceiver, track }) {
        handleRemoteStream({ receiver, streams, transceiver, track });
      }
    );
  }

  initDataChannel(
    chanelName: string,
    {
      handleError,
      handleMessage,
    }: { handleError?: () => void; handleMessage: handleDataChannelMessageType }
  ) {
    // If a datachannel already exists, use it
    // if not, create a new one
    // It's a kind of singleton pattern
    // so the user can call this function from anywhere
    const datachannel = this.datachannel || this.createDataChannel(chanelName);

    if (datachannel && this.connection) {
      // Listen for a data channel initiated
      // by the user we're connected to
      this.connection.addEventListener("datachannel", ({ channel }) => {
        this.datachannel = channel;
      });

      // Handle errors
      datachannel.addEventListener("error", () => {
        if (handleError) {
          handleError();
        }
      });

      // Handle messages receipt
      datachannel.addEventListener(
        "message",
        ({ data, origin, source, lastEventId, ports }) => {
          handleMessage({ data, origin, source, lastEventId, ports });
        }
      );
    }
  }

  private createDataChannel(chanelName: string) {
    if (this.connection) {
      // Create the data channel
      const channel = this.connection.createDataChannel(chanelName, {
        id: parseInt((Math.random() * 100).toFixed(0)),
        maxRetransmits: 3,
        maxPacketLifeTime: 1000 * 10, // 10 seconds
      });

      this.datachannel = channel;

      return channel;
    }

    return;
  }

  sendMessage(message: string | Blob | ArrayBuffer | ArrayBufferView) {
    const fn = () => {
      this.datachannel!.send(message as string); // A gateway to typescript craziness
    };

    if (this.datachannel) {
      if (this.datachannel.readyState === "open") {
        fn();
      } else {
        this.datachannel.addEventListener("open", fn);
      }
    }
  }

  private async getMedia(streamType?: StreamTypeType) {
    let stream: MediaStream | null;

    switch (streamType || this.streamType) {
      case "audio": {
        stream = await navigator.mediaDevices.getUserMedia({
          ...this.constraints,
          audio: false,
        });
        break;
      }

      case "video_screen": {
        stream = await navigator.mediaDevices.getDisplayMedia(this.constraints);
        break;
      }

      case "video_user": {
        stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        break;
      }
      default:
        throw new Error("NOT_RECOGNIZED_OPTION");
    }

    return stream;
  }

  async startRecord({
    timeslice,
    onStart,
  }: {
    timeslice: number;
    onStart?: (e: Event) => void;
  }) {
    if (!this.localStream) {
      throw new Error("NO_STREAM_TO_RECORD");
    }

    const recorder = new MediaRecorder(this.localStream);

    recorder.addEventListener("dataavailable", (event) => {
      this.blobs.push(event.data);
    });

    if (onStart) {
      recorder.addEventListener("start", onStart);
    }

    recorder.start(timeslice);
  }

  async pauseRecord() {}

  async stopRecord() {}

  get recordedData() {
    return this.blobs;
  }
}
