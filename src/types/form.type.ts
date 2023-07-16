import { QRL } from '@builder.io/qwik'
import type { Field, Prefix } from './field.type'

export interface FormProps {
	form_name: string
	fields: Field[]
	btnSubmit?: Btn
	btnReset?: Btn
	onSubmit?: QRL<(data: unknown) => void>;
	onUpdate?: QRL<(data: any) => void>;
	realtime?: boolean
	buttonsAction?: Prefix;
}

export interface Form extends FormProps {
	values: any
	valid: boolean
}

export interface SubmitHandler {
	type: string
	text: string
	classes: string[]
}

export interface Btn {
	text?: string
	classes?: string[]
	prefix?: Prefix
}

export interface Value {
	form_name: string;
	values: any;
}
