import React from 'react'

interface DatePartitionProps {
    lastCreated: string
    created: string
    offset: number
}

const DatePartition = (props: DatePartitionProps) => {
    const { lastCreated, created } = props

    function getDate(date: string) {
        return date ? date.substring(0, 10) : null
    }

    const lastDate = getDate(lastCreated)
    const thisDate = getDate(created)

    if (lastCreated && lastDate === thisDate ) return <div />

    return (
        <div style={styles.dateText} className='ce-message-date-text text-center'>
            { formatDateTime(getDateTime(created, props.offset)) }
        </div>
    )
}
export function getDateTime(date: string, offset: number) {
    // if (!date) return ''
    
    date = date.replace(' ', 'T')
    offset = offset ? offset : 0

    const year = date.substring(0,4)
    const month = date.substring(5,2)
    const day = date.substring(8,2)
    const hour = date.substring(11,2)
    const minute = date.substring(14,2)
    const second = date.substring(17,2)
    
    var d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
    d.setHours(d.getHours() + offset)
    return d
}

const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

export function formatTime(dateTime: Date) {
    var time = dateTime.toLocaleString('en-US')
    return time.split(' ')[1].slice(0, -3) + ' ' + time.slice(-2)
}

export function formatDate(dateTime: Date) {
    return formatter.format(dateTime);
}

export function formatDateTime(dateTime: Date) {
    return formatTime(dateTime) + ', ' + formatDate(dateTime)
}
export default DatePartition

const styles = {
    dateText: { 
        width: '100%', 
        paddingTop: '4px',
        paddingBottom: '10px',
        fontSize: '15px',
        color: 'rgba(0, 0, 0, .40)'
    }
}