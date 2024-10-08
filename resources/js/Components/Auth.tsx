import {Handle, Position} from "@xyflow/react";
import {FormEvent, useState} from "react";
import clsx from 'clsx'
import {useForm} from "@inertiajs/react";
import {Button, Checkbox, Description, Field, Fieldset, Input, Label} from "@headlessui/react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa6";

export function Auth() {
    const {data, setData, post, processing, errors} = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        remember: false,
    })

    const [toggle, setToggle] = useState(false);

    function submit(e: FormEvent) {
        e.preventDefault()
        post(route(toggle ? 'register' : 'login'))
    }

    return <>
        <form className="card bg-base-300 p-4 form-control" onSubmit={submit}>
            <Handle type="source" position={Position.Top} className="p-1 hover:p-2 transition-[padding]"/>
            <div className={clsx(!toggle && 'flex justify-end')}>
                <Button className='btn btn-sm nodrag' onClick={(e) => {e.preventDefault(); setToggle(!toggle)}} title={toggle ? "To login" : "To register"}>
                    {toggle ? <FaArrowLeft/> : <FaArrowRight/>}
                </Button>
            </div>

            <Fieldset>
                { toggle &&
                <Field>
                    <Label htmlFor="name" className="label w-min">Name:</Label>
                    <Input id="name" name="email" value={data.name} onChange={e => setData('name', e.target.value)}
                           type="name"
                           className={clsx("input input-sm input-bordered nodrag", errors.name && "input-error")}
                           invalid={errors.name !== undefined}/>
                    {errors.name && <Description className="text-error w-fit">{errors.name}</Description>}
                </Field>}
                <Field>
                    <Label htmlFor="email" className="label w-min">Email:</Label>
                    <Input id="email" name="email" value={data.email} onChange={e => setData('email', e.target.value)}
                           type="email"
                           className={clsx("input input-sm input-bordered nodrag", errors.email && "input-error")}
                           invalid={errors.email !== undefined}/>
                    {errors.email && <Description className="text-error w-fit">{errors.email}</Description>}
                </Field>
                <Field>
                    <Label htmlFor="password" className="label w-min">Password:</Label>
                    <Input id="password" name="password" value={data.password}
                           onChange={e => setData('password', e.target.value)} type="password"
                           className={clsx("input input-sm input-bordered nodrag", errors.password && "input-error")}
                           invalid={errors.password !== undefined}/>
                    {errors.password &&
                        <Description className="text-error w-fit">{errors.password}</Description>}
                </Field>
                { toggle &&
                <Field>
                    <Label htmlFor="password_confirmation" className="label w-fit">Reenter password:</Label>
                    <Input id="password_confirmation" name="password_confirmation" value={data.password_confirmation}
                           onChange={e => setData('password_confirmation', e.target.value)} type="password"
                           className={clsx("input input-sm input-bordered nodrag", errors.password_confirmation && "input-error")}
                           invalid={errors.password_confirmation !== undefined}/>
                    {errors.password_confirmation &&
                        <Description className="text-error w-fit">{errors.password_confirmation}</Description>}
                </Field>}
                <Field className="mt-2">
                    <Checkbox id="remeber" name="remeber" className="checkbox nodrag px-2" checked={data.remember}
                              onChange={e => setData('remember', e)}/>
                    <Label htmlFor="remeber" className="nodrag ml-1 w-min">Remember Me</Label>
                </Field>
            </Fieldset>
            <Button disabled={processing} className="btn nodrag mt-3" type="submit">
                {toggle ? 'Register' : 'Login'}
            </Button>
        </form>
    </>
};
