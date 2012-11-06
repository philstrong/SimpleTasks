/*
 * File: app/controller/Lists.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('SimpleTasks.controller.Lists', {
    extend: 'Ext.app.Controller',

    models: [
        'List'
    ],
    stores: [
        'Lists',
        'Tasks'
    ],
    views: [
        'lists.Tree',
        'lists.ContextMenu',
        'Toolbar'
    ],

    refs: [
        {
            ref: 'listTree',
            selector: 'listTree'
        },
        {
            ref: 'taskGrid',
            selector: 'taskGrid'
        },
        {
            ref: 'taskForm',
            selector: 'taskForm'
        },
        {
            autoCreate: true,
            ref: 'contextMenu',
            selector: 'listsContextMenu',
            xtype: 'listsContextMenu'
        }
    ],

    handleNewListCLick: function(component, e) {
        this.addList(true);
    },

    handleNewFolderClick: function(component, e) {
        this.addList();
    },

    handleDeleteClick: function(component, e) {
        this.deleteList(this.getListTree().getSelectionModel().getSelection()[0]);
    },

    handleDeleteFolderClick: function(component, e) {
        // workaround. one handler should be able to used by multiple selectors
        this.handleDeleteClick();
    },

    handleAfterListTreeRender: function(abstractcomponent, options) {
        var selModel = abstractcomponent.getSelectionModel();

        if (selModel.getCount() > 0){
            selModel.select(0);
        }
    },

    updateList: function(editor, e, options) {
        var me = this,
            list = e.record;

        list.save({
            success: function(list, operation) {
                // filter the task list by the currently selected list.  This is necessary for newly added lists
                // since this is the first point at which we have a primary key "id" from the server.
                // If we don't filter here then any new tasks that are added will not appear until the filter is triggered by a selection change.
                me.filterTaskGrid(me.getListTree().getSelectionModel(), [list]);
            },
            failure: function(list, operation) {
                var error = operation.getError(),
                    msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;

                Ext.MessageBox.show({
                    title: 'Update List Failed',
                    msg: msg,
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },

    handleCancelEdit: function(editor, e, options) {
        var list = e.record,
            parent = list.parentNode;

        parent.removeChild(list);
        this.getListTree().getSelectionModel().select([parent]);
    },

    handleDeleteIconClick: function(view, rowIndex, colIndex, column, e) {
        console.log('listTree delete icon fired');
        this.deleteList(view.getRecord(view.findTargetByEvent(e)));
    },

    updateTaskList: function(task, list) {
        var me = this,
            listId = list.get('id');

        // set the tasks list_id field to the id of the list it was dropped on
        task.set('list_id', listId);
        // save the task to the server
        task.save({
            success: function(task, operation) {
                // refresh the filters on the task list
                me.getTaskGrid().refreshFilters();
                // refresh the lists view so the task counts will be updated.
                me.getListTree().refreshView();
            },
            failure: function(task, operation) {
                var error = operation.getError(),
                    msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;

                Ext.MessageBox.show({
                    title: 'Move Task Failed',
                    msg: msg,
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },

    reorderList: function(list, overList, position) {
        var listsStore = this.getListsStore();

        if(listsStore.getProxy().type === 'localstorage') {
            listsStore.sync();
        }

        // refresh the lists view so the task counts will be updated.
        this.getListTree().refreshView();
    },

    showActions: function(view, list, node, rowIndex, e) {
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        if(view.getRecord(node).get('id') > 0) {
            Ext.each(icons, function(icon){
                Ext.get(icon).removeCls('x-hidden');
            });
        }
    },

    hideActions: function(view, list, node, rowIndex, e) {
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        Ext.each(icons, function(icon){
            Ext.get(icon).addCls('x-hidden');
        });
    },

    showContextMenu: function(view, list, node, rowIndex, e) {
        var contextMenu = this.getContextMenu(),
            newListItem = Ext.getCmp('new-list-item'),
            newFolderItem = Ext.getCmp('new-folder-item'),
            deleteFolderItem = Ext.getCmp('delete-folder-item'),
            deleteListItem = Ext.getCmp('delete-list-item');

        if(list.isLeaf()) {
            newListItem.hide();
            newFolderItem.hide();
            deleteFolderItem.hide();
            deleteListItem.show();
        } else {
            newListItem.show();
            newFolderItem.show();
            if(list.isRoot()) {
                deleteFolderItem.hide();
            } else {
                deleteFolderItem.show();
            }
            deleteListItem.hide();
        }
        contextMenu.setList(list);
        contextMenu.showAt(e.getX(), e.getY());
        e.preventDefault();
    },

    filterTaskGrid: function(selModel, lists) {
        var list = lists[0],
            tasksStore = this.getTasksStore(),
            listIds = [],
            deleteListBtn = Ext.getCmp('delete-list-btn'),
            deleteFolderBtn = Ext.getCmp('delete-folder-btn'),
            filters = tasksStore.filters.getRange(0, tasksStore.filters.getCount() - 1),
            filterCount = filters.length,
            i = 0;

        // first clear any existing filter
        tasksStore.clearFilter();

        // build an array of all the list_id's in the hierarchy of the selected list
        list.cascadeBy(function(list) {
            listIds.push(list.get('id'));
        });

        // remove any existing "list_id" filter from the filters array
        for(; i < filterCount; i++) {
            if(filters[i].property === 'list_id') {
                filters.splice(i, 1);
                filterCount --;
            }
        }

        // add the new list_ids to the filters array
        filters.push({ property: "list_id", value: new RegExp('^' + listIds.join('$|^') + '$') });

        // apply the filters
        tasksStore.filter(filters);

        // set the center panel's title to the name of the currently selected list
        this.getTaskGrid().setTitle(list.get('name'));

        // enable or disable the "delete list" and "delete folder" buttons depending on what type of node is selected
        if(list.get('id') === -1) {
            deleteListBtn.disable();
            deleteFolderBtn.disable();
        } else if(list.isLeaf()) {
            deleteListBtn.enable();
            deleteFolderBtn.disable();
        } else {
            deleteListBtn.disable();
            deleteFolderBtn.enable();
        }

        // make the currently selected list the default value for the list field on the new task form
        this.getTaskForm().query('[name=list_id]')[0].setValue(list.get('id'));
    },

    init: function(application) {
        var me = this,
            listsStore = me.getListsStore(),
            tasksStore = me.getTasksStore();

        if(listsStore.isLoading()) {
            listsStore.on('load', me.handleListsLoad, me);
        } else {
            me.handleListsLoad(listsStore);
        }
        listsStore.on('write', me.syncListsStores, me);

        this.control({
            "[iconCls=tasks-new-list]": {
                click: this.handleNewListCLick
            },
            "[iconCls=tasks-new-folder]": {
                click: this.handleNewFolderClick
            },
            "[iconCls=tasks-delete-list]": {
                click: this.handleDeleteClick
            },
            "[iconCls=tasks-delete-folder]": {
                click: this.handleDeleteFolderClick
            },
            "listTree": {
                afterrender: this.handleAfterListTreeRender,
                edit: this.updateList,
                canceledit: this.handleCancelEdit,
                deleteclick: this.handleDeleteIconClick,
                taskdrop: this.updateTaskList,
                listdrop: this.reorderList,
                itemmouseenter: this.showActions,
                itemmouseleave: this.hideActions,
                itemcontextmenu: this.showContextMenu,
                selectionchange: this.filterTaskGrid
            }
        });
    },

    handleListsLoad: function(listsStore, lists, success, operation) {
        var me = this,
            listTree = me.getListTree(),
            tasksStore = me.getTasksStore();

        if(listTree) {
            // if the list tree exists when the lists store is first loaded, select the root node.
            // when using a server proxy, the list tree will always exist at this point since asyncronous loading of data allows time for the list tree to be created and rendered.
            // when using a local storage proxy, the list tree will not yet exist at this point, so we'll have to select the root node on render instead (see handleAfterListTreeRender)
            listTree.getSelectionModel().select(0);
        }
        // wait until lists are done loading to load tasks since the task grid's "list" column renderer depends on lists store being loaded
        me.getTasksStore().load();
        // if the tasks store is asynchronous (server proxy) attach load handler for refreshing the list counts after loading is complete
        // if local storage is being used, isLoading will be false here since load() will run syncronously, so there is no need
        // to refresh the lists view because load will have happened before the list tree is even rendered
        if(tasksStore.isLoading()) {
            tasksStore.on('load', me.handleTasksLoad, me);
        }
        // remove the event listener after the first run
        listsStore.un('load', me.handleListsLoad, me);
    },

    addList: function(leaf) {
        var listTree = this.getListTree(),
            cellEditingPlugin = listTree.cellEditingPlugin,
            selectionModel = listTree.getSelectionModel(),
            selectedList = selectionModel.getSelection()[0],
            parentList, newList, expandAndEdit;

        // if no selected List then not a valid add
        if (!selectedList) {
            return;
        }

        parentList = selectedList.isLeaf() ? selectedList.parentNode : selectedList;

        newList = Ext.create('SimpleTasks.model.List', {
            name: 'New ' + (leaf ? 'List' : 'Folder'),
            leaf: leaf,
            loaded: true // set loaded to true, so the tree won't try to dynamically load children for this node when expanded
        });

        expandAndEdit = function() {
            if(parentList.isExpanded()) {
                selectionModel.select(newList);
                cellEditingPlugin.startEdit(newList, 0);
            } else {
                listTree.on('afteritemexpand', function startEdit(list) {
                    if(list === parentList) {
                        selectionModel.select(newList);
                        cellEditingPlugin.startEdit(newList, 0);
                        // remove the afterexpand event listener
                        listTree.un('afteritemexpand', startEdit);
                    }
                });
                parentList.expand();
            }
        };

        parentList.appendChild(newList);
        if(listTree.getView().isVisible(true)) {
            expandAndEdit();
        } else {
            listTree.on('expand', function onExpand() {
                expandAndEdit();
                listTree.un('expand', onExpand);
            });
            listTree.expand();
        }
    },

    deleteList: function(list) {
        if (!list) {
            return;
        }

        var me = this,
            listTree = me.getListTree(),
            listName = list.get('name'),
            selModel = listTree.getSelectionModel(),
            tasksStore = me.getTasksStore(),
            listsStore = me.getListsStore(),
            isLocal = this.getListsStore().getProxy().type === 'localstorage',
            filters, tasks;

        Ext.Msg.show({
            title: 'Delete List?',
            msg: 'Are you sure you want to permanently delete the "' + listName + '" list and all its tasks?',
            buttons: Ext.Msg.YESNO,
            fn: function(response) {
                if(response === 'yes') {
                    // save the existing filters
                    filters = tasksStore.filters.getRange(0, tasksStore.filters.getCount() - 1);
                    // clear the filters in the tasks store, we need to do this because tasksStore.queryBy only queries based on the current filter,
                    // but we need to query all lists in the store
                    tasksStore.clearFilter();
                    // recursively remove any tasks from the store that are associated with the list being deleted or any of its children.
                    (function deleteTasks(list) {
                        tasks = tasksStore.queryBy(function(task, id) {
                            return task.get('list_id') === list.get('id');
                        });
                        tasksStore.remove(tasks.getRange(0, tasks.getCount() - 1), !isLocal);

                        list.eachChild(function(child) {
                            deleteTasks(child);
                        });
                    })(list);
                    // reapply the filters
                    tasksStore.filter(filters);

                    // destroy the tree node on the server
                    list.parentNode.removeChild(list);
                    listsStore.sync({
                        failure: function(batch, options) {
                            var error = batch.exceptions[0].getError(),
                                msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;

                            Ext.MessageBox.show({
                                title: 'Delete List Failed',
                                msg: msg,
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        }
                    });

                    if(isLocal) {
                        // only need to sync the tasks store when using local storage.
                        // when using an ajax proxy we will allow the server to handle deleting any tasks associated with the deleted list(s)
                        tasksStore.sync();
                    }

                    if(!listsStore.getNodeById(selModel.getSelection()[0].get('id'))) { //if the selection no longer exists in the store (it was part of the deleted node(s))
                        // change selection to the "All Tasks" list
                        selModel.select(0);
                    }

                    // refresh the list view so the task counts will be accurate
                    listTree.refreshView();
                }
            }
        });
    },

    handleTasksLoad: function(tasksStore, tasks, success, operation) {
        var me = this,
            listTree = me.getListTree(),
            selectionModel = listTree.getSelectionModel();

        // refresh the lists view so the task counts will be updated.
        listTree.refreshView();
        // filter the task grid by the selected list
        me.filterTaskGrid(selectionModel, selectionModel.getSelection());
        // remove the event listener after the first run
        tasksStore.un('load', this.handleTasksLoad, this);
    },

    syncListsStores: function(listsStore, operation) {
        var me = this,
            stores = [
            Ext.getStore('Lists-TaskGrid'),
            Ext.getStore('Lists-TaskEditWindow'),
            Ext.getStore('Lists-TaskForm')
            ], 
            listToSync;

        Ext.each(operation.getRecords(), function(list) {
            Ext.each(stores, function(store) {
                if(store) {
                    listToSync = store.getNodeById(list.getId());
                    switch(operation.action) {
                        case 'create':
                        (store.getNodeById(list.parentNode.getId()) || store.getRootNode()).appendChild(list.copy());
                        break;
                        case 'update':
                        if(listToSync) {
                            listToSync.set(list.data);
                            listToSync.commit();
                        }
                        break;
                        case 'destroy':
                        if(listToSync) {
                            listToSync.remove(false);
                        }
                    }
                }
            });
        });
    }

});
