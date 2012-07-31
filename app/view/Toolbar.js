/*
 * File: app/view/Toolbar.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
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

Ext.define('SimpleTasks.view.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.tasksToolbar',

    width: 400,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    iconCls: 'tasks-new',
                    text: 'New',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                iconCls: 'tasks-new',
                                text: 'New Task'
                            },
                            {
                                xtype: 'menuitem',
                                iconCls: 'tasks-new-list',
                                text: 'New List'
                            },
                            {
                                xtype: 'menuitem',
                                iconCls: 'tasks-new-folder',
                                text: 'New Folder'
                            }
                        ]
                    }
                },
                {
                    xtype: 'button',
                    disabled: true,
                    id: 'delete-task-btn',
                    iconCls: 'tasks-delete-task'
                },
                {
                    xtype: 'button',
                    disabled: true,
                    id: 'mark-complete-btn',
                    iconCls: 'tasks-mark-complete'
                },
                {
                    xtype: 'button',
                    disabled: true,
                    id: 'mark-active-btn',
                    iconCls: 'tasks-mark-active'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                },
                {
                    xtype: 'button',
                    id: 'show-all-btn',
                    enableToggle: true,
                    iconCls: 'tasks-show-all',
                    toggleGroup: 'status'
                },
                {
                    xtype: 'button',
                    id: 'show-active-btn',
                    enableToggle: true,
                    iconCls: 'tasks-show-active',
                    toggleGroup: 'status'
                },
                {
                    xtype: 'button',
                    id: 'show-complete-btn',
                    enableToggle: true,
                    iconCls: 'tasks-show-complete',
                    toggleGroup: 'status'
                }
            ]
        });

        me.callParent(arguments);
    }

});