import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='h-[calc(100vh-64px)] max-w-6xl px-4 flex flex-row mx-auto my-16 justify-center'>
            <div className="flex flex-col item-center gap-4">
                <h1 className="text-2xl">Privacy Policy</h1>
                <div className="flex flex-col item-center">
                    <p>
                        We believe in protecting your privacy. We do not collect any personal information from our users. We do not share any information with third parties. We do not use cookies or any other tracking technologies.
                    </p>
                    <p>
                        We are committed to ensuring that your privacy is protected. If you have any questions or concerns about our privacy policy, please do not hesitate to contact us at <a className='links-border' href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>{import.meta.env.VITE_CONTACT_EMAIL}</a>. We will do our best to address your concerns and provide you with the information you need. 
                    </p>
                </div>
            </div>
        </div>
  )
}
