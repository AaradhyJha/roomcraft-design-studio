import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Box, 
  Plus, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Search,
  MoreVertical,
  Clock,
  Trash2,
  Copy,
  Edit,
  Loader2,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useProjects, Project } from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';
import { SettingsSection } from '@/components/dashboard/SettingsSection';
import { RenameDialog } from '@/components/dashboard/RenameDialog';
import { ShareDialog } from '@/components/dashboard/ShareDialog';

// Placeholder images for projects
const placeholderImages = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
];

type ActiveSection = 'projects' | 'settings';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { projects, isLoading: projectsLoading, createProject, deleteProject, duplicateProject, updateProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<ActiveSection>('projects');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    try {
      const result = await createProject.mutateAsync('Untitled Room');
      navigate(`/editor/${result.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleOpenProject = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteProject.mutateAsync(id);
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateProject = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    try {
      await duplicateProject.mutateAsync(project);
      toast({
        title: 'Project duplicated',
        description: 'Your project has been duplicated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate project',
        variant: 'destructive',
      });
    }
  };

  const handleRenameClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setRenameDialogOpen(true);
  };

  const handleRename = async (newName: string) => {
    if (!selectedProject) return;
    try {
      await updateProject.mutateAsync({ id: selectedProject.id, name: newName });
      toast({
        title: 'Project renamed',
        description: 'Your project has been renamed.',
      });
      setRenameDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename project',
        variant: 'destructive',
      });
    }
  };

  const handleShareClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setShareDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">
              Room<span className="gradient-text">Craft</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeSection === 'projects' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveSection('projects')}
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </Button>
          <Button 
            variant={activeSection === 'settings' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveSection('settings')}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {activeSection === 'projects' ? (
          <>
            {/* Header */}
            <header className="h-16 border-b border-border px-6 flex items-center justify-between">
              <h1 className="text-xl font-semibold font-heading">My Projects</h1>
              <Button variant="hero" onClick={handleCreateProject} disabled={createProject.isPending}>
                {createProject.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                New Project
              </Button>
            </header>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Search */}
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Loading State */}
              {projectsLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {/* Projects Grid */}
              {!projectsLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group glass rounded-xl overflow-hidden hover-lift cursor-pointer"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video bg-secondary/50 relative overflow-hidden">
                        <img 
                          src={project.thumbnail_url || getPlaceholderImage(index)} 
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button 
                            variant="glass" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => handleShareClick(e, project)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="glass" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => handleRenameClick(e, project)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleDuplicateProject(e, project)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => handleDeleteProject(e, project.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!projectsLoading && filteredProjects.length === 0 && (
                <div className="text-center py-16">
                  <Box className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
                  </p>
                  {!searchQuery && (
                    <Button variant="hero" onClick={handleCreateProject}>
                      <Plus className="w-4 h-4" />
                      Create Project
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Settings Header */}
            <header className="h-16 border-b border-border px-6 flex items-center">
              <h1 className="text-xl font-semibold font-heading">Settings</h1>
            </header>

            {/* Settings Content */}
            <div className="flex-1 overflow-auto">
              <SettingsSection />
            </div>
          </>
        )}
      </main>

      {/* Rename Dialog */}
      {selectedProject && (
        <RenameDialog
          open={renameDialogOpen}
          onOpenChange={setRenameDialogOpen}
          currentName={selectedProject.name}
          onRename={handleRename}
          isLoading={updateProject.isPending}
        />
      )}

      {/* Share Dialog */}
      {selectedProject && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
        />
      )}
    </div>
  );
}
