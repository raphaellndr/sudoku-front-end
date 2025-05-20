import { IconButton, Text } from '@chakra-ui/react';
import { MdEmail } from "react-icons/md";

const EmailButton = () => {
    const handleClick = () => {
        const subject = encodeURIComponent("Website Inquiry");
        const body = encodeURIComponent(`Hi Raphaël,

I hope you're doing well.

I recently visited your website and found it very interesting. Would it be possible to ask you some questions about it?

Thanks!

Best regards,
[Your Name]
        `);
        const mailtoLink = `mailto:raph.landure@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;
    };

    return (
        <IconButton
            onClick={handleClick}
            variant="ghost"
            _hover={{
                backgroundColor: "transparent",
            }}
        >
            <MdEmail size="24" />
            <Text display={{ base: "none", md: "flex" }}>
                Send email
            </Text>
        </IconButton>
    );
};

export default EmailButton;
