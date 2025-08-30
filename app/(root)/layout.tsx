import AppSidebar from "@/components/app-sidebar";
import GlobalProvider from "@/lib/global-provider";

const layout = ({ children }: { children: React.ReactNode }) => {
    return <main className="flex h-full w-full">
        <AppSidebar />
        <section className=" h-full w-full" style={{ marginLeft: "256px" }}>
            <GlobalProvider>
                {children}
            </GlobalProvider>
        </section>
    </main>;
};

export default layout;
