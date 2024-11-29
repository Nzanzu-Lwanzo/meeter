import { MouseEvent } from "react";
export interface ButtonPropsType {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}


export type User = {
  name: string;
  id: string;
};
