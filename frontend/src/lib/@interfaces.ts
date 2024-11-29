import {
  handleCandidateErrorFnType,
  handleCandidateFnType,
  handleRemoteStreamFnType,
  StreamTypeType,
} from "./@types";

export interface RTCConstructorType {
  constraints: MediaStreamConstraints;
  configurations: RTCConfiguration;
  streamType: StreamTypeType;
}

export interface CallRespondMethodParamsType {
  handlers: {
    handleCandidate: handleCandidateFnType;
    handleRemoteStream: handleRemoteStreamFnType;
  };
  options?: {
    handleError?: (e: Error) => void;
    handleCandidateError?: handleCandidateErrorFnType;
  };
}
export interface RespondMethodParamsExtensionType {
  streamType?: StreamTypeType;
  offer: RTCSessionDescriptionInit;
}

export type CallMethodReturnType = {
  stream: MediaStream | null;
  offer: RTCSessionDescriptionInit;
  streamType: StreamTypeType;
  call_id: string;
};

export type RespondMethodReturnType = {
  stream: MediaStream | null;
  answer: RTCSessionDescriptionInit;
  streamType: StreamTypeType;
};

export interface ConnectMethodParamsType {
  handleCandidate: handleCandidateFnType;
  handleRemoteStream: handleRemoteStreamFnType;
  handleCandidateError?: handleCandidateErrorFnType;
}
