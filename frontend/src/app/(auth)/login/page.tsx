import { Logo } from "@/components/layout"
import { LoginForm } from "@/features/auth"

export default function LoginPage() {
    return (
        <main className='min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30'>
            <div className='w-full max-w-md bg-card border border-border/60 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6'>
                <div className='flex flex-col items-center text-center space-y-2'>
                    <Logo size='lg' />
                    <div className='pt-2'>
                        <h1 className='text-xl font-bold tracking-tight text-foreground'>
                            Selamat Datang Kembali
                        </h1>
                        <p className='text-xs text-muted-foreground'>
                            Masukkan kredensial Anda untuk mengakses portal HRIS
                        </p>
                    </div>
                </div>

                <LoginForm />
            </div>

            <footer className='mt-8 text-center text-xs text-muted-foreground/80'>
                © {new Date().getFullYear()} HR Management System. Seluruh hak
                cipta dilindungi.
            </footer>
        </main>
    )
}
