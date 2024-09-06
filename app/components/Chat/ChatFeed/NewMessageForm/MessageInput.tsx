import React, { Component } from 'react'

interface MessageInputProps {
    handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
    label?: string;
    type?: string;
    onSubmit?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default class MessageInput extends Component<MessageInputProps> {
    state = {
        focused: false,
        value: null,
        height: 0,
        rows: 1
    }

    resize() {
        var textarea = document.getElementById("msg-textarea")!;
        textarea.style.height = "";
        const newHeight = Math.min(textarea.scrollHeight, 150);
        textarea.style.height = newHeight + "px";
        const newRows = Math.min(Math.floor(newHeight / 30), 5); // Assuming 30px per row
        this.setState({ height: newHeight, rows: newRows })
    }

    componentDidMount() { this.resize() }

    handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.resize()
        if (this.props.handleChange) {
            this.props.handleChange(e)
        }
    }

    onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault()

            if (this.props.value.length > 0) {
                this.props.onSubmit && this.props.onSubmit(e) 
            }
        } else if (e.key === 'Enter' && e.shiftKey) {
            this.resize()
        }
    }    

    render() {
        return (
            <textarea 
                id='msg-textarea'
                style={{
                    resize: 'none',
                    position: 'relative',
                    ...styles.input,
                    overflowX: 'hidden',
                    overflowY: this.state.rows === 5 ? 'auto' : 'hidden'
                }}
                rows={this.state.rows}
                value={this.props.value}
                placeholder={this.props.label}
                onBlur={() => this.setState({ focused: false })}
                onFocus={() => this.setState({ focused: true })}
                onChange={(e) => this.handleChange(e)} 
                onKeyDown={(e) => this.onKeyDown(e)}
                maxLength={120}
                required
            />
        )
    }
}

const styles = {
    input: { 
        border: '1px solid white',
        width: 'calc(100% - 64px - 24px - 44px)',
        outline: 'none', 
        fontSize: '15px',
        fontFamily: 'Avenir',
        paddingLeft: '12px',
        paddingRight: '12px',
        left: '12px',
    }
}