import { useAppContext } from "../../contexts/AppContext";
import VideoCallStore from "../../stores/VideoCallStore";
import { User } from "../../utils/@types";
import { ENV } from "../../utils/constants";

const LabelDev = ({
  auth,
  currentChat,
}: {
  auth: User | undefined;
  currentChat: User | undefined;
}) => {
  return (
    <span>
      {auth?.name ? `${auth.name} is` : "You are"} chatting with{" "}
      {currentChat?.name || "a user"}
    </span>
  );
};

const LabelProd = ({ currentChat }: { currentChat: User | undefined }) => {
  return <span>With {currentChat?.name || "a user"}</span>;
};

const Top = () => {
  const { auth } = useAppContext();
  const currentChat = VideoCallStore((state) => state.currentChat);

  return (
    <div className="card__top">
      <div className="chat__with">
        {ENV === "dev" ? (
          <LabelDev auth={auth} currentChat={currentChat} />
        ) : (
          <LabelProd currentChat={currentChat} />
        )}
      </div>
    </div>
  );
};

export default Top;
