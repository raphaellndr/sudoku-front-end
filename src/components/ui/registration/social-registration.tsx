import { Button } from "@chakra-ui/react"
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"

const SocialRegistration = () => {
    const handleSocialRegistration = (socials: string) => {
        signIn(socials, { callbackUrl: '/profile' });
    }

    return (
        <Button
            w={'full'}
            variant={'outline'}
            onClick={() => handleSocialRegistration("google")}
        >
            Sign up with Google <FcGoogle />
        </Button>
    )
}

export default SocialRegistration;