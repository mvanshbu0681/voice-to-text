
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesProvider } from '@/contexts/NotesContext';
import NoteForm from '@/components/NoteForm';
import NotesList from '@/components/NotesList';
import AppHeader from '@/components/AppHeader';

const Index = () => {
  return (
    <NotesProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-brand-gray-soft">
        <div className="container max-w-6xl px-4 py-6 mx-auto">
          <AppHeader className="mb-8" />
          
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="create">Create Note</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="mt-0">
              <NoteForm />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-0">
              <NotesList />
            </TabsContent>
          </Tabs>
          
          <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>Voice to Notes - Web Speech API Demo</p>
            <p className="mt-1">All processing happens client-side in your browser.</p>
          </footer>
        </div>
      </div>
    </NotesProvider>
  );
};

export default Index;
