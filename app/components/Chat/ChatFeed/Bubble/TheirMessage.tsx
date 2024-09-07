import React, { useState, useContext } from 'react'
import { getFileName, isImage } from './file'
import FileView from './FileView'
import Thumbnail from './Thumbnail'
import Body from './Body'
import { Row, Col, setConfiguration } from 'react-grid-system'
import { Avatar } from 'antd'

setConfiguration({ maxScreenClass: 'xl' })


const TheirMessage = (props: { message: any; lastMessage?: any; nextMessage?: any }) => {
    // const { conn } = useContext(ChatEngineContext)
    const [hovered, setHovered] = useState(false)

    function renderImages() {
        const { message } = props
        const attachments = message && message.attachments ? message.attachments : []

        return attachments.map((attachment: { file: string }, index: any) => {
            const fileName = getFileName(attachment.file)
            if (isImage(fileName)) {
                return <Thumbnail attachment={attachment} key={`attachment_${index}`} />
            } else {
                return <div key={`attachment${index}`} />
            }
        })
    }

    function renderFiles() {
        const { message } = props
        const attachments = message && message.attachments ? message.attachments : []

        return attachments.map((attachment: { file: string }, index: any) => {
            const fileName = getFileName(attachment.file)
            if (!isImage(fileName)) {
                return <FileView attachment={attachment} key={`attachment_${index}`} />
            } else {
                return <div key={`attachment${index}`} />
            }
        })
    }

    const { lastMessage, message, nextMessage } = props

    if (!message) { return <div /> }

    const attachments = message && message.attachments && message.attachments

    const topLeftRadius = !lastMessage || lastMessage.sender_username !== message.sender_username ? '1.3em' : '0.3em'
    const bottomLeftRadius = !nextMessage || nextMessage.sender_username !== message.sender_username ? '1.3em' : '0.3em'

    const borderRadius = `${topLeftRadius} 1.3em 1.3em ${bottomLeftRadius}`
    const paddingBottom = !nextMessage || nextMessage.sender_username !== message.sender_username ? '12px' : '2px'

    console.log(message)

    return (
        <div
            style={{ width: '100%', paddingBottom }}
            className='ce-message-row ce-their-message'
        >
            {
                (!lastMessage || lastMessage.sender_username !== message.sender_username) &&
                <div style={styles.nameText} className='ce-their-message-sender'>
                    {message.sender_username}
                </div>
            }

            <Row style={{ paddingLeft: '2px' }} className='ce-their-message-row'>
                <Col xs={12} sm={12} md={12}>
                    <div style={{ height: '0px' }} className='ce-their-message-avatar'>
                        {
                            (!nextMessage || nextMessage.sender_username !== message.sender_username) &&
                            // <Avatar
                            //     show_online={false}
                            //     username={message.sender_username}
                            //     avatar={message.sender && message.sender.avatar}
                            // />
                            <><Avatar
                                src={message.sender ? message.sender.avatar : ""}
                                alt={message.sender_username}
                            // online={otherPerson.person.is_online}
                            />
                            </>
                        }
                    </div>

                    <div
                        style={{ display: 'auto', paddingLeft: '50px' }}
                        className='ce-their-message-attachments-container ce-their-message-images-container'
                    >
                        {renderImages()}
                    </div>

                    <div
                        style={{ display: 'auto', paddingLeft: '50px' }}
                        className='ce-their-message-attachments-container ce-their-message-files-container'
                    >
                        {renderFiles()}
                    </div>

                    {
                        (message.text &&
                            <div style={{ paddingLeft: '48px' }}>
                                <div
                                    className='ce-message-bubble ce-their-message-bubble float-left'
                                    style={{ 'float': 'left', ...styles.theirMessage, ...{ borderRadius } }}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                >
                                    <Body text={message.text} myMessage={false} />
                                </div>
                            </div>)
                    }
                </Col>

                {/* Col is 9 to not slipp into RHS */}
                {/* <Col
                    xs={9}
                    style={{ marginLeft: '48px' }}
                    className='ce-reads-row ce-their-reads-row'
                >
                    {renderReads()}
                </Col> */}
            </Row>
        </div>
    )
}

export default TheirMessage

const styles = {
    theirMessage: {
        cursor: 'pointer',
        color: 'black',
        // float: 'left',
        padding: '12px',
        fontSize: '15px',
        whiteSpace: 'pre-line',
        backgroundColor: '#f1f0f0',
        // overflowWrap: 'anywhere',
        maxWidth: 'calc(100% - 100px)',
    },
    nameText: {
        paddingLeft: '62px',
        paddingBottom: '2px',
        color: 'rgba(0, 0, 0, .40)',
        fontSize: '15px'
    },
    status: {
        width: '10px',
        height: '10px',
        borderRadius: '100%',
        border: '2px solid #d3d8e4de',
        // position: 'absolute',
        top: '35px'
    },
}