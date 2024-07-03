import { createRoute } from "honox/factory";

import Upload from "../islands/Upload";

export default createRoute((c) => {
  return c.render(<Upload />, { title: "Share" });
});
