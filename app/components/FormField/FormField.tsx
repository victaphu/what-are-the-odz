import { Field } from 'formik';
export const FormField = ({ name, type = 'text', placeholder }: {
    name: string
    type?: 'text' | 'password' | 'email' | 'number'
    placeholder?: string
}) => (
    <label>
        <Field name={name} type={type} placeholder={placeholder} maxLength={20} />
    </label>
)


