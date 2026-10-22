"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";
import {loginSchema, LoginSchema} from "@/validation/auth/schemas/login.schema";
import {useLogin} from "@/hooks/auth/useLogin";
import Image from "next/image";

export default function Login() {
    const mutation = useLogin();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginSchema) => {
        mutation.mutate(values);
    };

    return (
        <Card className="w-full max-w-sm border-white/10 bg-card/80 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Image src="/DotCode_Logo_White.png" alt="Dot Code Logo" width={100} height={100} />
                </div>
                <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
                <CardDescription>
                    لوحة تحكم إدارة Dot Code Portfolio
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>البريد الإلكتروني</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="admin@example.com"
                                            dir="ltr"
                                            disabled={mutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>كلمة المرور</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="••••••••"
                                            dir="ltr"
                                            disabled={mutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <CardFooter className="p-0 pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={mutation.isPending}>
                                {mutation.isPending && (
                                    <Loader2 className="size-4 animate-spin ml-2" />
                                )}
                                تسجيل الدخول
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
