import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
    <div className='h-[calc(100vh-64px)] max-w-6xl px-4 flex flex-row mx-auto my-16 justify-center'>
            <div className="flex flex-col item-center gap-4">
                <h1 className="text-2xl">Contact Us</h1>
                <div className="flex flex-col item-center">
                    <p>
                        For any inquiries, please reach out to us at <a className='links-border' href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>{import.meta.env.VITE_CONTACT_EMAIL}</a>
                    </p>
                    <p>
                        We look forward to hearing from you and will respond to your message as soon as possible.
                        Since, we are a small team, please allow us some time to get back to you. Thank you for your understanding and support!
                    </p>
                </div>
            </div>
        </div>
    )
}
