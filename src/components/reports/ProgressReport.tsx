import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface Contributor {
    name: string;
    amount: number;
    giftItem: string;
}

interface GiftItem {
    name: string
    price: number
    contributedAmount: number
}

interface ProgressReportProps {
    listName: string;
    totalAmount: number;
    contributedAmount: number;
    contributors: Contributor[];
    giftItems: GiftItem[];
}

export function ProgressReport({
    listName,
    totalAmount,
    contributedAmount,
    contributors,
    giftItems
}: ProgressReportProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    const overallPercentage = (contributedAmount / totalAmount) * 100
    const completedItems = giftItems.filter(item => item.contributedAmount >= item.price)

    const contributionData = [
        { name: 'Contributed', value: contributedAmount },
        { name: 'Remaining', value: totalAmount - contributedAmount }
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    const itemPercentages = giftItems.map(item => ({
        name: item.name,
        percentage: (item.contributedAmount / item.price) * 100
    }))

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{listName} - Progress Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Overall Contribution</h3>
                            <Progress value={overallPercentage} className="w-full h-4" />
                            <p className="text-sm text-muted-foreground mt-1">
                                ${contributedAmount.toFixed(2)} of ${totalAmount.toFixed(2)} ({overallPercentage.toFixed(2)}%)
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={contributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        activeIndex={activeIndex}
                                        onMouseEnter={(_, index) => setActiveIndex(index)}
                                    >
                                        {contributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-64 w-full rounded-md border">
                        <div className="p-4">
                            {contributors.map((contributor, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <span>{contributor.name}</span>
                                    <div className="text-right">
                                        <span>${contributor.amount.toFixed(2)} - {contributor.giftItem}</span>
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            ({((contributor.amount / totalAmount) * 100).toFixed(2)}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gift Items Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={itemPercentages}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="percentage" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold">Completed Items: {completedItems.length}/{giftItems.length}</h4>
                        <ScrollArea className="h-40 w-full rounded-md border mt-2">
                            <div className="p-4">
                                {giftItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-1">
                                        <span>{item.name}</span>
                                        <span>{((item.contributedAmount / item.price) * 100).toFixed(2)}%</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

