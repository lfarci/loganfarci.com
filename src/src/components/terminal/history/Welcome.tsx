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
            <pre style={{ fontSize: '0.5em' }}>{message}</pre>
            <br/>
            <p>Hi 👋, welcome on my personal website! I&apos;m a Passionate and results-driven Software Engineer specializing in Microsoft technologies, with a focus on C#, .NET, Visual Studio, and Azure. With three years of hands-on experience in the public, banking, and energy sectors in Belgium, I&apos;ve demonstrated expertise in crafting robust solutions and driving digital innovation.</p>
            <br/>
            <p>Type &apos;help&apos; to see a list of commands.</p>
            <br/>
        </div>
    );
}