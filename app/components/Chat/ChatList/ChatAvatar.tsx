import { useEffect, useRef, useState } from "react";
import React from "react";
import AvatarEditor from 'react-avatar-editor'
import { Image } from "semantic-ui-react";

export const ChatAvatar = ({ file, close, onSubmit, crop = false, username, userstatus }: {
  file: File,
  close: () => void,
  onSubmit: (blob?: Blob, newUsername?: string, newStatus?: string) => void,
  crop?: boolean,
  username?: string,
  userstatus?: string
}) => {

  const [imageSrc, setImageSrc] = useState("");
  const cropRef = useRef<AvatarEditor | null>(null);
  const [newUsername, setNewUsername] = useState(username);
  const [newStatus, setNewStatus] = useState(userstatus);

  useEffect(() => {
    const fr = new FileReader();
    fr.onload = () => setImageSrc(fr.result as string);
    fr.readAsDataURL(file);
  }, [file]);

  return (
    <div className="chat-new-avatar">
      {crop ? (
        <AvatarEditor
          ref={cropRef}
          width={100}
          height={100}
          border={40}
          borderRadius={50}
          image={imageSrc}
        />
      ) : (
        <Image size="medium" src={imageSrc} alt="preview" />
      )}
              
      <div className="image-upload-actions">
        <button className="cancel" onClick={close}>
          Cancel
        </button>
        <button
          className="submit"
          onClick={() => {
            if (crop && cropRef.current) {
              const canvas = cropRef.current
                .getImageScaledToCanvas()
                .toDataURL();
              fetch(canvas)
                .then((res) => res.blob())
                .then((blob) => onSubmit(blob, newUsername, newStatus));
            } else {
              onSubmit();
            }
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
};
