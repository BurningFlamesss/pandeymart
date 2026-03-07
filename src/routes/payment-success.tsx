import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payment-success')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center'>
    Congratulations!!! Your payment was successful. You will receive your product soon.
  </div>
}
