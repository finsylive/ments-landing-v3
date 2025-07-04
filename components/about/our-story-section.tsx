import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Award, Rocket } from "lucide-react"

export function OurStorySection() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 py-20">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">Our Story</h2>

        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="founded" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white p-2 shadow-lg">
              <TabsTrigger value="founded" className="rounded-xl data-[state=active]:bg-green-100">
                Founded
              </TabsTrigger>
              <TabsTrigger value="aws" className="rounded-xl data-[state=active]:bg-green-100">
                AWS Credits
              </TabsTrigger>
              <TabsTrigger value="beta" className="rounded-xl data-[state=active]:bg-green-100">
                Community Building
              </TabsTrigger>
            </TabsList>

            <TabsContent value="founded" className="mt-8">
              <Card className="rounded-2xl bg-white shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Founded & Pre-incubated</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    Ments was founded and pre-incubated at Nirmaan IIT Madras, where our vision of connecting the
                    startup ecosystem began to take shape. With the support of one of India's premier institutions, we
                    laid the foundation for what would become a transformative platform.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aws" className="mt-8">
              <Card className="rounded-2xl bg-white shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">AWS Activate Credits</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    We were awarded AWS Activate Credits, recognizing our potential and providing us with the cloud
                    infrastructure needed to scale our platform. This milestone validated our approach and gave us the
                    technical foundation to serve thousands of users.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="beta" className="mt-8">
              <Card className="rounded-2xl bg-white shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Rocket className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Beta Launch Success</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    We created our community "Future Innovators," where 800+ cross-college students and entrepreneurs joined us, finding the vision of Ments useful and inspiring.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
