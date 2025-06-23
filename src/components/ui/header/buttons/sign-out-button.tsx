import { signOut } from "next-auth/react"
import { IoMdExit } from "react-icons/io"

import TooltipIconButton from "../../tooltip-icon-button"

const SignOutButton = () => {
    return (
        <TooltipIconButton
            leftIcon={<IoMdExit />}
            tooltipText="Sign out"
            variant="ghost"
            display={{ base: "none", md: "inline-flex" }}
            onClick={() => signOut()}
        />
    );
};

export default SignOutButton;
