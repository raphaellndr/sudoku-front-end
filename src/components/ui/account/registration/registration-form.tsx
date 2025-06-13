import { signIn } from "next-auth/react";
import { Button, Input, Stack } from "@chakra-ui/react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterFormValues } from "@/types/forms";
import { RegisterFormSchema } from "@/schemas/forms";

import { Field } from "../../field"
import { PasswordInput } from "../../password-input";

const RegistrationForm = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterFormSchema),
    });

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        const userData = {
            email: data.email,
            password1: data.password,
            password2: data.confirmPassword,
            ...(data.username && { username: data.username })
        };
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "api/auth/register/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                }
            )
            if (response.ok) {
                reset();
                await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: true,
                    callbackUrl: "/",
                })
            } else {
                const errorData = await response.json();
                console.log("Error data: ", errorData)
            }
        } catch (e: unknown) {
            const error = e as Error;
            console.log("Error: ", error)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4" align="stretch" maxW="sm">
                <Field
                    label="Username"
                    invalid={!!errors.username}
                    errorText={errors.username?.message}
                >
                    <Input
                        {...register("username")}
                    />
                </Field>
                <Field
                    label="Email"
                    invalid={!!errors.email}
                    errorText={errors.email?.message}
                >
                    <Input
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                </Field>
                <Field
                    label="Password"
                    invalid={!!errors.password}
                    errorText={errors.password?.message}
                >
                    <PasswordInput
                        {...register("password", { required: "Password is required" })}
                    />
                </Field>
                <Field
                    label="Confirm password"
                    invalid={!!errors.confirmPassword}
                    errorText={errors.confirmPassword?.message}
                >
                    <Input
                        {...register("confirmPassword", { required: "Password confirmation is required" })} type="password"
                    />
                </Field>
                <Button type="submit">Create account</Button>
            </Stack>
        </form>
    )
}

export default RegistrationForm;