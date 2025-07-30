
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

export default function Footer() {


    return (
        <footer className="py-12 bg-secondary/30">
            <div className="w-full flex items-center justify-center px-4">
                <div className="w-[700px]">
                    <div className="flex flex-col md:flex-row justify-center items-center">

                        <div className="flex items-center space-x-6">
                            <a
                                href="https://github.com/zerotwoadarsh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-accent transition-colors"
                                aria-label="GitHub"
                            >
                                <GithubIcon size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/adarsh-kushwaha-0b0268274"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-accent transition-colors"
                                aria-label="LinkedIn"
                            >
                                <LinkedinIcon size={18} />
                            </a>
                            <a
                                href="https://twitter.com/zerotwoadarsh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-accent transition-colors"
                                aria-label="Twitter"
                            >
                                <TwitterIcon size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
