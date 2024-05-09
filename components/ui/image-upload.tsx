'use clinet'

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value:string) => void;
    onRemove: (value:string) => void;
    value: string[];
}

const ImgaeUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    // hydration guard
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    },[])

    /** any?? unlnownの方が良さそう */
    const onUpload = (result:any) => {
        onChange(result.info.secure_url);
    }

    if (!isMounted) return null;

    return (
        <div>
            <div className="mp-4 flex items-center gap-3">
            {value.map((url) => (
                <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                    <div className="z-10 absolute top-2 right-2">
                        <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(url)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image
                        fill
                        src={url}
                        alt="image"
                        className="object-cover"
                    />
                </div>
            ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="u10qmup7">
                {({open}) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <Button 
                            type="button" 
                            onClick={onClick} 
                            variant="secondary"
                            disabled={disabled}>
                            <ImagePlus className="h-4 w-4" />
                            UPLOAD IMAGE
                        </Button>
                    )
                }}
            </CldUploadWidget> 
        </div>
    )
}

export default ImgaeUpload;
