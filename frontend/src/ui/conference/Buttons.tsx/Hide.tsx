import VideoCallStore from "../../../stores/VideoCallStore";
import videoCall from "../../../utils/meeting.setup";

const Hide = () => {
  const { feedState, setFeedState } = VideoCallStore();

  return (
    <button
      type="button"
      onClick={() => {
        // For explanations, see Mute.tsx component
        let isOk = videoCall.toggleHide(feedState.hidden);

        if (isOk) {
          setFeedState({ hidden: !feedState.hidden });
        }
      }}
    >
      {feedState.hidden ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <rect width="256" height="256" fill="none" />
          <polyline
            points="200 112 248 80 248 176 200 144"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <line
            x1="48"
            y1="40"
            x2="208"
            y2="216"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M113.06,64H192a8,8,0,0,1,8,8v87.63"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M186.18,192H32a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H69.82"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <rect width="256" height="256" fill="none" />
          <rect
            x="24"
            y="64"
            width="176"
            height="128"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <polyline
            points="200 112 248 80 248 176 200 144"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
      )}
    </button>
  );
};

export default Hide;
