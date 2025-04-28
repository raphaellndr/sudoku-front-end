import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Accordion, Button, Field, Input, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsFormValues } from "@/types/types";
import { SettingsFormSchema } from "@/types/schemas";
import { notifyError, notifySuccess } from "@/toasts/toast";
import { useEffect } from "react";

const filterNonEmptyFields = (data: SettingsFormValues) => {
    const filteredData = Object.keys(data).reduce<Partial<SettingsFormValues>>((acc, key) => {
        const k = key as keyof SettingsFormValues;
        const value = data[k];
        if (value !== undefined && value !== null && value !== "") {
            acc[k] = value;
        }
        return acc;
    }, {});
    return filteredData;
};

const SettingsBody = () => {
    const { data: session, update } = useSession();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(SettingsFormSchema),
    });

    useEffect(() => {
        if (!session) {
            router.push("/solver")
        }
    }, [session])

    const emailValue = watch("email");

    const onSubmit = handleSubmit(async (data) => {
        const userData = filterNonEmptyFields(data);

        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + "api/auth/user/",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + session?.accessToken,
                },
                body: JSON.stringify(userData),
            }
        );

        if (response.ok) {
            notifySuccess("User data updated successfully!");

            // Trigger a session update
            update({
                ...session,
                user: {
                    ...session?.user,
                    ...userData
                }
            });
        } else {
            const errorData = await response.json();
            console.error("Error updating user data: ", errorData);
            notifyError("Error updating user data");
        }
    });

    return (
        <Accordion.ItemBody>
            <form onSubmit={onSubmit}>
                <Stack gap="4" align="flex-end" maxW="sm">
                    <Field.Root invalid={!!errors.username}>
                        <Field.Label>Username</Field.Label>
                        <Input {...register("username")} placeholder="New username" />
                        <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={Boolean(errors.email) && Boolean(emailValue)}>
                        <Field.Label>Email</Field.Label>
                        <Input {...register("email")} placeholder="New email" />
                        {errors.email && emailValue && (
                            <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                        )}
                    </Field.Root>

                    <Button type="submit">Save changes</Button>
                </Stack>
            </form>
        </Accordion.ItemBody>
    );
};

export default SettingsBody;