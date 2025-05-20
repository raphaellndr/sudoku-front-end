import CustomCard from "../custom-card";

const AboutSections = () => {
    return (
        <>
            <CustomCard
                title="My Background"
                description="I am an engineer specialized in computer science, with a strong
                    background in data and AI. Throughout my career, I've always been
                    fascinated by the potential of technology to solve complex problems."
                rootProps={{
                    size: "sm",
                    _hover: {
                        shadow: "lg",
                        transform: "translateY(-1px)",
                        transition: "all 0.2s ease-in-out",
                    }
                }}
                bodyProps={{ color: "fg.muted" }}
            />

            <CustomCard
                title="The Inspiration"
                description="A few years ago, as part of my studies, I worked on a project aimed
                    at solving Sudokus. This project sparked my interest in exploring web development,
                    an area I had always wanted to learn but never found the time to dive into."
                rootProps={{ size: "sm", bg: "", border: "none" }}
                bodyProps={{ color: "fg.muted" }}
            />

            <CustomCard
                title="The Journey"
                description="Last year, I decided to start the Sudoku solver project from scratch.
                    This year, I took it a step further by creating a website using this
                    project to solve Sudokus. The goal was to train myself and learn web development,
                    showcasing what I could achieve in a short amount of time, all by myself."
                rootProps={{
                    size: "sm",
                    _hover: {
                        shadow: "lg",
                        transform: "translateY(-1px)",
                        transition: "all 0.2s ease-in-out",
                    }
                }}
                bodyProps={{ color: "fg.muted" }}
            />

            <CustomCard
                title="The Purpose"
                description="SudokuArena is not just a project; it's a testament to my journey of
                    learning and growth. It's a way to demonstrate my skills to recruiters,
                    peers, and most importantly, to myself. It represents my capability to
                    learn, adapt, and create something meaningful."
                rootProps={{ size: "sm", bg: "", border: "none" }}
                bodyProps={{ color: "fg.muted" }}
            />
        </>
    );
};

export default AboutSections;
