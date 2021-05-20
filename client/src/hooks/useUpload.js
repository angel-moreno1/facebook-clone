import { useEffect, useMemo, useState } from "react"

const useUpload = fileName => {

    const [ file, setFile ] = useState('')

    const onInputChange = ({ target }) => setFile(target.files[0])
    const form = useMemo(() => new FormData(), [])
    
    useEffect(() => {
        form.delete(fileName)
        form.append(fileName, file)
    }, [file, fileName, form])
    
    return [
        form,
        file,
        onInputChange,
        setFile
    ]

}

export default useUpload