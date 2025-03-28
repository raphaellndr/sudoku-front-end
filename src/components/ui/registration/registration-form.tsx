import { Button, Input, Separator, Stack } from "@chakra-ui/react"
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field } from "../field"
import { PasswordInput } from "../password-input";
import AccountAlreadyExists from "./account-already-exists";
import SocialRegistration from "./social-registration";
import { UserFormValues } from "@/types/types";
import { UserFormSchema } from "@/types/schemas";

const RegistrationForm = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(UserFormSchema),
    });

    const notifyAccountCreated = () => toast.success("Successfully created account!");
    const notifyError = (message: string) => toast.error(
        message,
        {
            position: "bottom-right",
        }
    );

    const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
        const userData = {
            email: data.email,
            password1: data.password,
            password2: data.confirmPassword,
            ...(data.username && { username: data.username })
        };
        // Send registration request to the server
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
                // Empty the form, notify and log in with provided credentials
                reset();
                notifyAccountCreated();
                await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: true,
                    callbackUrl: "/",
                })
            } else {
                const errorData = await response.json();
                console.log("Error data: ", errorData)
                notifyError("Failed to create account: " + errorData);
            }
        } catch (e: unknown) {
            const error = e as Error;
            notifyError(`An error occurred while creating your account: ${error.message}`);
        }
    };

    return (
        <div>
            <ToastContainer />
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
                    <Separator size="sm" />
                    <SocialRegistration />
                    <Separator size="sm" />
                    <AccountAlreadyExists />
                </Stack>
            </form>
        </div>
    )
}

export default RegistrationForm;