import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  Plus,
  Edit2,
  Trash2,
  ArrowRightLeft,
  ChevronRight,
  ChevronDown,
  X,
  Check
} from 'lucide-react';
import { FileItem } from '../types';

interface FileTreeProps {
  files: FileItem[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (name: string, dir: string) => void;
  onRenameFile: (oldPath: string, newName: string) => void;
  onMoveFile: (oldPath: string, newPath: string) => void;
  onDeleteFile: (path: string) => void;
  theme: 'dark' | 'light';
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: { [key: string]: TreeNode };
}

export default function FileTree({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onMoveFile,
  onDeleteFile,
  theme
}: FileTreeProps) {
  const isDark = theme === 'dark';
  const [collapsed, setCollapsed] = useState<{ [path: string]: boolean }>({});
  
  // Create File State
  const [creatingInDir, setCreatingInDir] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  // Rename State
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Move State
  const [movingPath, setMovingPath] = useState<string | null>(null);
  const [moveValue, setMoveValue] = useState('');

  // Group files into a tree
  const buildTree = (): TreeNode => {
    const root: TreeNode = { name: 'root', path: '', isFolder: true, children: {} };
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = root;
      let cumulativePath = '';
      
      parts.forEach((part, index) => {
        cumulativePath = cumulativePath ? `${cumulativePath}/${part}` : part;
        const isLast = index === parts.length - 1;
        
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: cumulativePath,
            isFolder: !isLast,
            children: {}
          };
        }
        current = current.children[part];
      });
    });
    
    return root;
  };

  const toggleCollapse = (path: string) => {
    setCollapsed(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const handleStartCreate = (e: React.MouseEvent, dirPath: string) => {
    e.stopPropagation();
    setCreatingInDir(dirPath);
    setNewFileName('');
  };

  const handleConfirmCreate = () => {
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim(), creatingInDir || '');
    setCreatingInDir(null);
    setNewFileName('');
  };

  const handleStartRename = (e: React.MouseEvent, file: TreeNode) => {
    e.stopPropagation();
    setRenamingPath(file.path);
    setRenameValue(file.name);
  };

  const handleConfirmRename = () => {
    if (!renameValue.trim() || !renamingPath) return;
    onRenameFile(renamingPath, renameValue.trim());
    setRenamingPath(null);
    setRenameValue('');
  };

  const handleStartMove = (e: React.MouseEvent, file: TreeNode) => {
    e.stopPropagation();
    setMovingPath(file.path);
    setMoveValue(file.path);
  };

  const handleConfirmMove = () => {
    if (!moveValue.trim() || !movingPath) return;
    onMoveFile(movingPath, moveValue.trim());
    setMovingPath(null);
    setMoveValue('');
  };

  const renderNode = (node: TreeNode, depth: number) => {
    if (node.name === 'root') {
      return Object.values(node.children)
        .sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.name.localeCompare(b.name);
        })
        .map(child => renderNode(child, 0));
    }

    const isFolderCollapsed = collapsed[node.path];
    const isActive = activeFilePath === node.path;

    return (
      <div key={node.path} className="flex flex-col select-none">
        {/* Row element */}
        <div
          onClick={() => {
            if (node.isFolder) {
              toggleCollapse(node.path);
            } else {
              onSelectFile(node.path);
            }
          }}
          className={`group flex items-center justify-between px-2 py-1.5 mx-1 my-0.5 rounded-lg text-xs cursor-pointer transition-all ${
            isActive
              ? isDark
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/50'
                : 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-900/60'
              : 'text-slate-700 hover:bg-slate-200/50'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {node.isFolder ? (
              <>
                <span className="text-slate-500 hover:text-slate-300">
                  {isFolderCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </span>
                {isFolderCollapsed ? (
                  <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
              </>
            ) : (
              <FileCode
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              />
            )}

            {/* Renaming inline or normal name */}
            {renamingPath === node.path ? (
              <input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleConfirmRename();
                  if (e.key === 'Escape') setRenamingPath(null);
                }}
                autoFocus
                className="bg-slate-950 border border-cyan-500/50 px-1 py-0.5 rounded text-[11px] font-mono text-white focus:outline-none w-28"
              />
            ) : (
              <span className="truncate font-mono text-[11px]">{node.name}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
            {renamingPath === node.path ? (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleConfirmRename();
                  }}
                  className="p-0.5 bg-emerald-500/20 hover:bg-emerald-500/40 rounded text-emerald-400"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setRenamingPath(null);
                  }}
                  className="p-0.5 bg-red-500/20 hover:bg-red-500/40 rounded text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : movingPath === node.path ? (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute z-50 bg-slate-900 border border-slate-800 p-2 rounded-xl shadow-2xl flex flex-col gap-1.5 w-48 text-[10px] -ml-24"
              >
                <span className="text-slate-400 font-bold font-mono">Move file path:</span>
                <input
                  type="text"
                  value={moveValue}
                  onChange={e => setMoveValue(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-white font-mono"
                />
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={handleConfirmMove}
                    className="px-2 py-0.5 bg-cyan-600 text-white rounded font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setMovingPath(null)}
                    className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {node.isFolder && (
                  <button
                    onClick={e => handleStartCreate(e, node.path)}
                    className={`p-0.5 rounded transition-all ${
                      isDark
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                        : 'hover:bg-slate-200 text-slate-500 hover:text-slate-950'
                    }`}
                    title="Add file here"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={e => handleStartRename(e, node)}
                  className={`p-0.5 rounded transition-all ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                      : 'hover:bg-slate-200 text-slate-500 hover:text-slate-950'
                  }`}
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {!node.isFolder && (
                  <button
                    onClick={e => handleStartMove(e, node)}
                    className={`p-0.5 rounded transition-all ${
                      isDark
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                        : 'hover:bg-slate-200 text-slate-500 hover:text-slate-950'
                    }`}
                    title="Move / Relocate"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete ${node.name}?`)) {
                      onDeleteFile(node.path);
                    }
                  }}
                  className="p-0.5 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Inline Creation Form under this folder */}
        {creatingInDir === node.path && (
          <div
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 p-1 mx-2 my-1 bg-slate-900 border border-slate-800 rounded-lg"
            style={{ marginLeft: `${depth * 12 + 24}px` }}
          >
            <input
              type="text"
              placeholder="filename.kt..."
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConfirmCreate()}
              className="bg-slate-950 border border-slate-850 px-1.5 py-0.5 text-[10px] text-white rounded font-mono w-24 focus:outline-none"
            />
            <button
              onClick={handleConfirmCreate}
              className="p-0.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/40"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setCreatingInDir(null)}
              className="p-0.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Folder Children rendering */}
        {node.isFolder && !isFolderCollapsed && (
          <div className="flex flex-col">
            {Object.values(node.children)
              .sort((a, b) => {
                if (a.isFolder && !b.isFolder) return -1;
                if (!a.isFolder && b.isFolder) return 1;
                return a.name.localeCompare(b.name);
              })
              .map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const treeRoot = buildTree();

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {renderNode(treeRoot, 0)}
    </div>
  );
}
