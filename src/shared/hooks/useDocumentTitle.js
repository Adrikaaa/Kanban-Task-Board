import { useEffect } from "react";
import { PROJECT_NAME } from "../../app/constants/site";

export let useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · ${PROJECT_NAME}` : PROJECT_NAME;
  }, [title]);
};
