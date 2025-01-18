import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Trash2 } from 'lucide-react'

interface List {
    id: number;
    name: string;
    eventType: string;
    createdAt: string;
    status: 'active' | 'draft' | 'overdue';
}

interface MyListsProps {
    onEdit?: (listId: number) => void;
}

const mockLists: List[] = [
    { id: 1, name: "Boda de Juan y María", eventType: "Boda", createdAt: "2023-06-01", status: 'active' },
    { id: 2, name: "Baby Shower de Ana", eventType: "Baby Shower", createdAt: "2023-05-15", status: 'active' },
    { id: 3, name: "Cumpleaños de Pedro", eventType: "Cumpleaños", createdAt: "2023-04-30", status: 'overdue' },
    { id: 4, name: "Aniversario", eventType: "Otro", createdAt: "2023-06-10", status: 'draft' },
]

export function MyLists({ onEdit }: MyListsProps) {
    const [lists, setLists] = useState<List[]>(mockLists)

    const filteredLists = (status: 'active' | 'draft' | 'overdue') => lists.filter(list => list.status === status)

    const handleDelete = (id: number) => {
        setLists(lists.filter(list => list.id !== id))
    }

    const ListCard = ({ list }: { list: List }) => (
        <Card key={list.id}>
            <CardContent className="flex justify-between items-center p-4">
                <div>
                    <h3 className="font-semibold">{list.name}</h3>
                    <p className="text-sm text-muted-foreground">{list.eventType} - Creada el {list.createdAt}</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit?.(list.id)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(list.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mis Listas</h1>
            <Tabs defaultValue="active">
                <TabsList>
                    <TabsTrigger value="active">Activas</TabsTrigger>
                    <TabsTrigger value="drafts">Borradores</TabsTrigger>
                    <TabsTrigger value="overdue">Vencidas</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="space-y-4">
                    {filteredLists('active').map(list => <ListCard key={list.id} list={list} />)}
                </TabsContent>
                <TabsContent value="drafts" className="space-y-4">
                    {filteredLists('draft').map(list => <ListCard key={list.id} list={list} />)}
                </TabsContent>
                <TabsContent value="overdue" className="space-y-4">
                    {filteredLists('overdue').map(list => <ListCard key={list.id} list={list} />)}
                </TabsContent>
            </Tabs>
        </div>
    )
}

