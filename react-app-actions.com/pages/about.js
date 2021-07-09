import SignUp from 'components/signup';

function AboutPage() {
    return (
        <div className="max-w-xl mx-auto">
            <div className="block w-32 h-32 my-12 overflow-hidden border-4 rounded-full border-brand-green">
                <img src="/img/avatar.jpg" alt="Avatar of Miklos" />
            </div>
            <p className="my-8 text-lg font-medium text-gray-600">
                Hi! My name is Miklos, and I've been working on the problem of E2E for a few years now.
            </p>
            <p className="my-8 text-lg font-medium text-gray-600">
                E2E testing is a high reward, high-cost way to test. High reward, because a relatively simple test can
                cover a large number of features. However, it is high cost, because it's very hard to get it right.
            </p>
            <p className="my-8 text-lg font-medium text-gray-600">
                For this reason, I started working on React App Actions. I believe I'm after something big with this
                simple idea: this is a testing tool that hooks into the internal state of React, which opens a window to
                a lot of smart tricks.
            </p>
            <p className="my-8 text-lg font-medium text-gray-600">
                If you’re interested, lend me your email and I’ll keep you updated!
            </p>
            <div className="mx-auto mt-16">
                <SignUp label="Sign up" />
            </div>
        </div>
    );
}

export default AboutPage;
