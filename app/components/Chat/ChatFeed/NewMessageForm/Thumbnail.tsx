import React, { useState, useEffect } from 'react'
import { CloseCircleTwoTone } from '@ant-design/icons'

interface ThumbnailProps {
    file: File
    onRemove?: () => void
}

const Thumbnail = (props: ThumbnailProps) => {
    const [hovered, setHovered] = useState(false)
    const [blob, setBlob] = useState('')
    useEffect(() => {
      setBlob(URL.createObjectURL(props.file))
    }, [props.file])
    return (
        <div 
            style={{ padding: '12px 6px', display: 'inline-block', position: "relative" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            
            <img
                className="object-cover"
                style={styles.imageSquare}
                alt={props.file ? props.file.name : ''}
                src={blob}
            />

            {
                hovered &&
                <CloseCircleTwoTone 
                    className="absolute"
                    style={styles.closeIcon} 
                    onClick={() => props.onRemove && props.onRemove()}
                />
            }
        </div>
    )
}

export default Thumbnail

const styles = {
    imageSquare: { 
        height: '108px', 
        width: '108px', 
        border: '1px solid #afafaf',
        borderRadius: '8px',
        // objectFit: 'cover',
        display: 'inline',
    },
    closeIcon: {
        // position: 'absolute', 
        bottom: 'calc(100% - 32px)', 
        left: '96px', 
        width: '0px', 
        cursor: 'pointer'
    }
}
