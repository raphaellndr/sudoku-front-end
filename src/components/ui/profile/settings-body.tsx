import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Accordion, Button, Field, Input, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsFormValues } from "@/types/types";
import { SettingsFormSchema } from "@/types/schemas";
import { notifySuccess } from "@/toasts/toast";
import { createHeaders } from "@/utils/apiUtils";
import { partialUpdateCurrentUser } from "@/services/meApi";
import { filterNonEmptyFields } from "@/utils/formUtils";

const SettingsBody = () => {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const headers = createHeaders(session);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(SettingsFormSchema),
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/solver")
        }
    }, [status])

    const emailValue = watch("email");

    const onSubmit = handleSubmit(async (data) => {
        setIsSubmitting(true);

        const userData = filterNonEmptyFields(data);
        await partialUpdateCurrentUser(headers, userData);

        notifySuccess("User data updated successfully!");
        update({
            ...session,
            user: {
                ...session?.user,
                ...userData
            }
        });

        setIsSubmitting(false);
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

                    <Button type="submit" loading={isSubmitting}>Save changes</Button>
                </Stack>
            </form>
        </Accordion.ItemBody>
    );
};

export default SettingsBody;
