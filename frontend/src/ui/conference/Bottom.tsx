import Hangout from "./Buttons.tsx/Hangout";
import Mute from "./Buttons.tsx/Mute";
import Hide from "./Buttons.tsx/Hide";

const Bottom = () => {
  return (
    <div className="card__bottom center">
      <div className="buttons">
        <Mute />
        <Hangout />
        <Hide />
      </div>
    </div>
  );
};

export default Bottom;
