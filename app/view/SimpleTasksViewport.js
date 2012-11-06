/*
 * File: app/view/SimpleTasksViewport.js
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

Ext.define('SimpleTasks.view.SimpleTasksViewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'SimpleTasks.view.Toolbar',
        'SimpleTasks.view.lists.Tree',
        'SimpleTasks.view.tasks.Grid'
    ],

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tasksToolbar',
                    region: 'north'
                },
                {
                    xtype: 'listTree',
                    width: 300,
                    collapsible: true,
                    region: 'west',
                    split: true
                },
                {
                    xtype: 'taskGrid',
                    title: 'All Lists',
                    region: 'center'
                }
            ]
        });

        me.callParent(arguments);
    }

});