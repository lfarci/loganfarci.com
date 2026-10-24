// https://www.asciiart.eu/text-to-ascii-art DOS Rebel
const message = `
█████                                                 ███████████                               ███
░░███                                                 ░░███░░░░░░█                              ░░░
░███         ██████   ███████  ██████   ████████      ░███   █ ░   ██████   ████████   ██████  ████
░███        ███░░███ ███░░███ ░░░░░███ ░░███░░███     ░███████    ░░░░░███ ░░███░░███ ███░░███░░███
░███       ░███ ░███░███ ░███  ███████  ░███ ░███     ░███░░░█     ███████  ░███ ░░░ ░███ ░░░  ░███
░███      █░███ ░███░███ ░███ ███░░███  ░███ ░███     ░███  ░     ███░░███  ░███     ░███  ███ ░███
███████████░░██████ ░░███████░░████████ ████ █████    █████      ░░████████ █████    ░░██████  █████
░░░░░░░░░░░  ░░░░░░   ░░░░░███ ░░░░░░░░ ░░░░ ░░░░░    ░░░░░        ░░░░░░░░ ░░░░░      ░░░░░░  ░░░░░
                    ███ ░███
                    ░░██████
`;

export default function Welcome() {
    return (
        <div>
            <pre style={{ fontSize: "0.5em" }}>{message}</pre>
            <br />
            <p>
                Hi 👋, welcome to my personal website! I&apos;m a Software Engineer with over five years of experience
                building enterprise applications and Azure cloud platforms. I work across C#/.NET, Terraform, GitHub
                Actions, and AI-assisted developer tooling.
            </p>
            <br />
            <p>Type &apos;help&apos; to see a list of commands.</p>
            <br />
        </div>
    );
}
