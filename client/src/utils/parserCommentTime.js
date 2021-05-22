
    import moment from 'moment'

    const parserCommentTime = time => {
        const timePart =  moment(time).toNow().split(' ')
        const wordTime = timePart[0]
        return timePart.filter(word => word !== wordTime).join(' ')
    }

    export default parserCommentTime