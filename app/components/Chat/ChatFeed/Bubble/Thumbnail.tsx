import React, { useState } from 'react'
import { LoadingOutlined, FileOutlined, } from "@ant-design/icons";

interface ThumbnailProps {
    attachment: any
}

const Thumbnail = (props: ThumbnailProps) => {
    const [hovered, setHovered] = useState(false)
    const { attachment } = props
    const style={ 
        ...styles.thumbnail, 
        ...{ border: hovered ? '1px solid #1890ff' : '1px solid #fff' } 
    }

    if (!attachment) {
        return (
            <div style={styles.loadingContainer} className='text-right object-cover'>
                <LoadingOutlined  style={{ color: 'white', padding: '4px', fontSize: '24px' }} />
            </div>
        )
    }

    return (
        // @ts-nocheck @next/next/no-img-element
        <img 
            onClick={() => window.open(attachment.file)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            src={attachment.file}
            alt={'thumb-nail'}
            style={style}
            className='text-right object-cover'
        />
    )
}

export default Thumbnail

const styles = {
    loadingContainer: {
        
        cursor: 'pointer',
        // textAlign: 'right', 
        display: 'inline-block', 
        // objectFit: 'cover',
        borderRadius: '0.3em',
        marginRight: '2px',
        marginBottom: '4px',
        height: '30vw', 
        width: '30vw', 
        maxHeight: '200px',
        maxWidth: '200px',
        minHeight: '100px',
        minWidth: '100px',
        backgroundColor: '#d9d9d9',
    },
    thumbnail: { 
        cursor: 'pointer',
        // textAlign: 'right', 
        display: 'inline', 
        // objectFit: 'cover',
        borderRadius: '0.3em',
        paddingRight: '2px',
        height: '30vw', 
        width: '30vw', 
        maxHeight: '200px',
        maxWidth: '200px',
        minHeight: '100px',
        minWidth: '100px',
    }
}