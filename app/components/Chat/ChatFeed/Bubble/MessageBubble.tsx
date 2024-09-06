import React, { useContext } from 'react'
import DatePartition from './DatePartition'
import MyMessage from './MyMessage'
import TheirMessage from './TheirMessage'
import SendingMessage from './SendingMessage'
import { useAuth } from '@/app/context/AuthContext'

export interface Person {
    username: string;
    avatar?: string;
    is_online?: boolean;
}

export interface Attachment {
    file: string;
    name: string;
}

export interface Message {
    id: string;
    created: string;
    sender_username: string;
    text: string;
    attachments?: Attachment[];
    sender?: Person;
}

export interface ChatPerson {
    person: Person;
    last_read?: string;
}

interface MessageProps {
    lastMessage?: Message;
    message: Message;
    nextMessage?: Message;
    sending?: boolean;
}


const Message = (props: MessageProps) => {
    const { lastMessage, message, nextMessage, sending } = props
    const { user } = useAuth();

    if (!message) { return <div /> }

    // if (!conn || conn === null) { return <div /> }
    // if (conn.userName === "john%20doe") return null
    return (
        <div className='ce-message-and-date'>
            {/* {
                !sending &&
                <DatePartition
                    lastCreated={lastMessage ? lastMessage.created : ''}
                    created={message.created}
                    offset={0}
                />
            } */}

            {
                sending ?
                    <SendingMessage
                        message={message}
                        lastMessage={lastMessage!}
                        nextMessage={nextMessage!}
                    /> :
                    <div>
                        {
                            message.sender_username === user?.name ?
                                <MyMessage
                                    message={message}
                                    lastMessage={lastMessage}
                                    nextMessage={nextMessage}
                                /> :
                                <TheirMessage
                                    message={message}
                                    lastMessage={lastMessage}
                                    nextMessage={nextMessage}
                                />
                        }
                    </div>
            }
        </div>
    )
}
export default Message