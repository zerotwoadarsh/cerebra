import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContentCard from '@/components/ContentCard';
import FilterDropdown from '@/components/FilterDropdown';
import AddContentDialog from '@/components/AddContentDialog';
import ShareBrainDialog from '@/components/ShareBrainDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Content {
  _id: string;
  type: 'document' | 'tweet' | 'youtube' | 'link';
  link: string;
  title: string;
  tags: string[];
  content?: string;
}

const Dashboard = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/content`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setContent(response.data.content as Content[]);
        const tags = (response.data.content as Content[]).flatMap((item: Content) => item.tags);
        const uniqueTags = Array.from(new Set(tags)) as string[];
        setAllTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content. Please try again later.');
      }
    };
    fetchContent();
  }, []);

  const navigate = useNavigate();

  const filteredContent = content.filter(item => {
    const matchesSearchTerm = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags?.includes(tag) ?? false);
    return matchesSearchTerm && matchesTags;
  });

  const handleDelete = async (_id: string) => {
    if (!_id) {
      toast.error('Invalid content ID');
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: { contentId: _id.toString() }
      });
      setContent(prev => prev.filter(item => item._id !== _id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content.');
    }
  };

  const handleContentAdded = async (newContent: Omit<Content, "_id">) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/content`, newContent, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const addedContent = response.data;
      setContent(prev => [...prev, addedContent]);
      const newTags = newContent.tags.filter(tag => !allTags.includes(tag));
      if (newTags.length > 0) {
        setAllTags(prev => [...prev, ...newTags]);
      }
      setIsAddDialogOpen(false);
      toast.success('Content added successfully');
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Toaster />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
        onAddContent={() => setIsAddDialogOpen(true)}
        onShareBrain={() => setIsShareDialogOpen(true)}
      />

      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "pl-20" : "pl-64"
      )}>
        <div className="container mx-auto px-6 py-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-2xl font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              Brainly
            </h1>
            
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full md:w-1/2 lg:w-2/3">
              <Input
                type="search"
                placeholder="Search your brain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="w-full md:w-auto">
              <FilterDropdown
                allTags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredContent.map((item) => (
              <motion.div key={`content-${item._id}`} variants={itemVariants}>
                <ContentCard content={item} onDelete={() => handleDelete(item._id)} />
              </motion.div>
            ))}
            {filteredContent.length === 0 && (
              <motion.div
                key="empty-state"
                className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-background rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-muted rounded-full mb-4 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Content Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedTags.length > 0
                    ? "Try adjusting your search or filters."
                    : "Click 'Add Content' to get started."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Note
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <AddContentDialog
            onAdd={handleContentAdded}
            onClose={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <ShareBrainDialog onClose={() => setIsShareDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
