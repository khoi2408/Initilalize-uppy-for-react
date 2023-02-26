import React from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/url/dist/style.css";
import GoogleDrive from "@uppy/google-drive";
import OneDrive from "@uppy/onedrive";
const Transloadit = require("@uppy/transloadit");
// import ImageEditor from "@uppy/image-editor";

const App = () => {
  const uppy = React.useMemo(() => {
    return new Uppy()
      .use(GoogleDrive, {
        companionUrl: Transloadit.COMPANION,
        companionAllowedHosts: Transloadit.COMPANION_PATTERN,
      })
      .use(OneDrive, {
        companionUrl: Transloadit.COMPANION,
        companionAllowedHosts: Transloadit.COMPANION_PATTERN,
      });
    // .use(ImageEditor, { target: Dashboard });
  }, []);
  uppy.on("upload", (data) => {
    console.log("upload started", data);
  });

  uppy.on("complete", (result) => {
    const { successful, failed } = result;
    if (successful.length > 0) {
      successful.forEach((file) => {
        const img = new Image();
        img.width = 300;
        img.alt = file.name;
        img.src = file.preview;
        document.body.appendChild(img);
      });
    }

    if (failed.length > 0) {
      console.error("Failed uploads:");
      failed.forEach((file) => {
        console.error(file.error);
      });
    }
  });

  const handleClick = () => {
    uppy.upload().then((result) => {
      const { successful, failed } = result;
      if (successful.length > 0) {
        console.info("Successful uploads:", result.successful);
      }

      if (failed.length > 0) {
        console.error("Failed uploads:");
        failed.forEach((file) => {
          console.error(file.error);
        });
      }
    });
  };

  React.useEffect(() => {
    return () => uppy.close();
  }, []);

  return (
    <div>
      {/* <button onClick={handleClick}>Click</button> */}
      <Dashboard
        uppy={uppy}
        width="100%"
        plugins={["GoogleDrive", "OneDrive", "ImageEditor"]}
        metaFields={[
          { id: "name", name: "Tên File", placeholder: "File name" },
          { id: "caption", name: "Caption", placeholder: "add description" },
        ]}
      />
    </div>
  );
};

export default App;
