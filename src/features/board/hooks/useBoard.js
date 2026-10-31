import { useContext } from "react";
import { BoardContext } from "../state/BoardContext";

export let useBoard = () => {
  let value = useContext(BoardContext);
  if (!value) throw new Error("useBoard must be used inside BoardProvider");
  return value;
};
