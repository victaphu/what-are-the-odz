import React, { useState } from 'react'
// import { getFileName, isImage } from './file'
// import Thumbnail from './Thumbnail'
// import FileView from './FileView'
import Body from './Body'
import { Row, Col, setConfiguration } from 'react-grid-system'

setConfiguration({ maxScreenClass: 'xl' })

const Message = (props: { chat?: any; message: any; lastMessage?: any; nextMessage?: any }) => {
    const [hovered, setHovered] = useState(false)
    
    // function renderImages() {
    //     const { message } = props
    //     const attachments = message && message.attachments ? message.attachments : []

    //     return attachments.map((attachment: { file: string }, index: any) => {
    //         const fileName = getFileName(attachment.file)
    //         if (isImage(fileName)) {
    //             return <Thumbnail attachment={attachment} key={`attachment_${index}`} />
    //         } else {
    //             return <div key={`attachment${index}`} />
    //         }
    //     })
    // }

    // function renderFiles() {
    //     const { message } = props
    //     const attachments = message && message.attachments ? message.attachments : []

    //     return attachments.map((attachment: { file: string }, index: any) => {
    //         const fileName = getFileName(attachment.file)
    //         if (!isImage(fileName)) {
    //             return <FileView attachment={attachment} key={`attachment_${index}`} />
    //         } else {
    //             return <div key={`attachment${index}`} />
    //         }
    //     })
    // }

    const { lastMessage, message, nextMessage } = props

    if (!message) { return <div /> }

    const attachments = message && message.attachments && message.attachments

    const topRightRadius = !lastMessage || lastMessage.sender_username !== message.sender_username ? '1.3em' : '0.3em'
    const bottomRightRadius = !nextMessage || nextMessage.sender_username !== message.sender_username ? '1.3em' : '0.3em'

    const borderRadius = `1.3em ${topRightRadius} ${bottomRightRadius} 1.3em`
    const paddingBottom = !nextMessage || nextMessage.sender_username !== message.sender_username ? '12px' : '2px'
   
    return (
        <div
            className='ce-message-row ce-my-message'
            style={{ width: '100%', textAlign: 'right', paddingBottom }}
        >
            <Row
                style={{ paddingRight: '2px' }}
                className='ce-message-bubble-row ce-my-message-bubble-row'
            >
                <Col xs={12} sm={12} md={12}>
                    {
                        (message.text &&
                        <div
                            className='ce-message-bubble ce-my-message-bubble text-left float-right'
                            style={{ ...styles.myMessage, ...{ borderRadius }, 'float': 'right', 'textAlign': 'left' }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Body myMessage={true} text={message.text} />
                        </div>)
                    }
                </Col>

                <Col xs={1} sm={2} md={3} />
            </Row>
        </div>
    )
}

export default Message

const styles = {
    myMessage: {
        color: 'white',
        cursor: 'pointer',
        // float: 'right', textAlign: 'left', // Stay right but render text
        padding: '12px',
        fontSize: '15px',
        whiteSpace: 'pre-line',
        backgroundColor: 'rgb(24, 144, 255)',
        // overflowWrap: 'anywhere',
        maxWidth: 'calc(100% - 100px)'
    }
}