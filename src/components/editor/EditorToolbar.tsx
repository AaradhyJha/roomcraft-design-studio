import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editorStore';
import { Link, useParams } from 'react-router-dom';
import { 
  Box, 
  Save, 
  Undo, 
  Redo, 
  Grid3X3,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  MousePointer,
  Move,
  RotateCcw,
  Maximize,
  PenTool,
  Check,
  Copy
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export function EditorToolbar() {
  const { id } = useParams();
  const { currentProject, isGridVisible, toggleGrid, activeTool, setActiveTool, setDrawingWall, setWallStartPoint } = useEditorStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/editor/${id}`;

  const handleToolChange = (tool: 'select' | 'move' | 'rotate' | 'scale' | 'wall') => {
    if (tool !== 'wall') {
      setDrawingWall(false);
      setWallStartPoint(null);
    }
    setActiveTool(tool);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Project link has been copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl px-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Box className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">{currentProject?.name || 'Untitled Project'}</h1>
              <p className="text-xs text-muted-foreground">
                {id === 'new' ? 'New Project' : 'Editing'}
              </p>
            </div>
          </div>
        </div>

        {/* Center - Tools */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'select' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => handleToolChange('select')}
              >
                <MousePointer className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select (V)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'move' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => handleToolChange('move')}
              >
                <Move className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move (G)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'rotate' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => handleToolChange('rotate')}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate (R)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'scale' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => handleToolChange('scale')}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Scale (S)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'wall' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => handleToolChange('wall')}
              >
                <PenTool className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Draw Wall (W)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled>
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled>
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isGridVisible ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={toggleGrid}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Mode</TooltipContent>
          </Tooltip>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShareDialogOpen(true)}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button variant="hero" size="sm">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </header>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Project
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Share this link with others to let them view your project.
            </p>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyLink} variant="secondary">
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
