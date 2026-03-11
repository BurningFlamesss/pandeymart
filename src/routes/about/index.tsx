import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='h-[calc(100vh-64px)] max-w-6xl px-4 flex flex-row mx-auto my-16 justify-center'>
            <div className="flex flex-col item-center gap-4">
                <h1 className="text-2xl">About Us</h1>
                <div className="flex flex-col item-center">
                    <p>
                        We are a company dedicated to providing the best products and services to our customers. Our team is committed to excellence and customer satisfaction.
                    </p>
                    <p>
                        Our mission is to create innovative solutions that meet the needs of our customers and make their lives easier. We value integrity, transparency, and collaboration in everything we do.
                    </p>
                </div>
            </div>
        </div>
  )
}
