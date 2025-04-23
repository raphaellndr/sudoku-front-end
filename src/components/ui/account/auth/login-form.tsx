import { signIn } from "next-auth/react";

import { Button, Input, Stack } from "@chakra-ui/react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field } from "../../field"
import { PasswordInput } from "../../password-input";
import { SignInFormValues } from "@/types/types";
import { SignInFormSchema } from "@/types/schemas";

const LoginForm = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(SignInFormSchema),
    });

    const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: true,
                callbackUrl: "/",
            })

            if (result?.error) {
                console.error("Authentication error: ", result.error);
            } else {
                reset();
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
                <Button type="submit">Sign in</Button>
            </Stack>
        </form>
    )
}

export default LoginForm;